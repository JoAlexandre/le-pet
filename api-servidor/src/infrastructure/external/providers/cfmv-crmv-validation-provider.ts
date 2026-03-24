import {
  CrmvValidationProvider,
  CrmvValidationResult,
} from '../../../application/interfaces/crmv-validation-provider';
import { DomainError } from '../../../shared/errors';
import { logger } from '../../../shared/logger';
import { chromium } from 'playwright';

export class CfmvCrmvValidationProvider implements CrmvValidationProvider {
  private readonly searchUrl = 'https://app.cfmv.gov.br/paginas/busca';

  async validate(crmvNumber: string, crmvState: string): Promise<CrmvValidationResult> {
    let browser;

    try {
      logger.info(`[CFMV] Starting CRMV lookup: number=${crmvNumber}, state=${crmvState}`);

      logger.debug('[CFMV] Launching headless Chromium...');
      browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();
      logger.debug('[CFMV] Browser launched successfully');

      logger.debug(`[CFMV] Navigating to ${this.searchUrl}`);
      await page.goto(this.searchUrl, { waitUntil: 'networkidle', timeout: 30000 });
      logger.debug(`[CFMV] Page loaded, current URL: ${page.url()}`);

      // Loga o HTML da pagina para debug dos seletores
      const pageTitle = await page.title();
      logger.debug(`[CFMV] Page title: ${pageTitle}`);

      // Verifica quais elementos existem na pagina
      const radioInputs = await page.locator('input[type="radio"]').count();
      const selectElements = await page.locator('select').count();
      const textInputs = await page.locator('input[type="text"]').count();
      const buttons = await page.locator('button').count();
      logger.debug(
        `[CFMV] Page elements found: radios=${radioInputs}, selects=${selectElements}, ` +
          `textInputs=${textInputs}, buttons=${buttons}`,
      );

      // Loga os valores dos radio buttons
      const radioValues = await page
        .locator('input[type="radio"]')
        .evaluateAll((els: any[]) => els.map((el) => ({ name: el.name, value: el.value })));
      logger.debug(`[CFMV] Radio buttons: ${JSON.stringify(radioValues)}`);

      // Loga as opcoes do select
      const selectOptions = await page
        .locator('select option')
        .evaluateAll((els: any[]) => els.map((el) => ({ value: el.value, text: el.textContent })));
      logger.debug(`[CFMV] Select options: ${JSON.stringify(selectOptions)}`);

      // Loga os botoes
      const buttonTexts = await page.locator('button').evaluateAll((els: any[]) =>
        els.map((el) => ({
          tag: el.tagName,
          text: el.textContent?.trim(),
          type: el.type,
          classes: el.className,
          disabled: el.disabled,
        })),
      );
      logger.debug(`[CFMV] Buttons: ${JSON.stringify(buttonTexts)}`);

      // Loga todos os elementos clicaveis (a, button, input[type=submit])
      const clickables = await page
        .locator('a, button, input[type="submit"]')
        .evaluateAll((els: any[]) =>
          els.map((el) => ({
            tag: el.tagName,
            text: el.textContent?.trim()?.substring(0, 50),
            type: el.type,
            href: el.href,
            classes: el.className?.substring?.(0, 80),
          })),
        );
      logger.debug(`[CFMV] Clickable elements: ${JSON.stringify(clickables)}`);

      // Dump um trecho do HTML para entender a estrutura
      const bodyHtml = await page.locator('body').innerHTML();
      logger.debug(`[CFMV] Page HTML (first 3000 chars): ${bodyHtml.substring(0, 3000)}`);

      // Seleciona "Pessoa fisica"
      logger.debug('[CFMV] Clicking radio "pf" (Pessoa fisica)...');
      await page.click('input[type="radio"][value="pf"]');
      logger.debug('[CFMV] Selected Pessoa fisica');

      // Seleciona o estado (UF)
      logger.debug(`[CFMV] Selecting state: ${crmvState.toUpperCase()}`);
      await page.selectOption('select', crmvState.toUpperCase());
      logger.debug('[CFMV] State selected');

      // Seleciona metodo "Identico"
      logger.debug('[CFMV] Clicking radio "3" (Identico)...');
      await page.click('input[type="radio"][value="3"]');
      logger.debug('[CFMV] Selected method Identico');

      // Seleciona "Inscricao" no campo de busca
      logger.debug('[CFMV] Clicking radio "2" (Inscricao)...');
      await page.click('input[type="radio"][value="2"]');
      logger.debug('[CFMV] Selected search field Inscricao');

      // Preenche o numero do CRMV no campo de texto
      logger.debug(`[CFMV] Filling text input with: ${crmvNumber}`);
      await page.fill('input[type="text"]', crmvNumber);
      logger.debug('[CFMV] Text input filled');

      // Loga o HTML apos preencher o formulario
      const formHtml = await page.locator('body').innerHTML();
      logger.debug(
        `[CFMV] Form HTML after fill (first 3000 chars): ${formHtml.substring(0, 3000)}`,
      );

      // Tenta encontrar o botao de submit por varios seletores
      const submitCandidates = await page
        .locator('button, input[type="submit"], a.btn, [role="button"]')
        .evaluateAll((els: any[]) =>
          els.map((el) => ({
            tag: el.tagName,
            text: el.textContent?.trim()?.substring(0, 50),
            type: el.type,
            classes: el.className?.substring?.(0, 100),
            visible: el.offsetParent !== null,
          })),
        );
      logger.debug(`[CFMV] Submit candidates after form fill: ${JSON.stringify(submitCandidates)}`);

      // Intercepta a resposta da API antes de clicar
      logger.debug('[CFMV] Setting up API response listener...');
      const responsePromise = page.waitForResponse(
        (response) => {
          const matches = response.url().includes('/pf/consultaInscricao/');
          if (matches) {
            logger.debug(
              `[CFMV] Intercepted response: URL=${response.url()}, status=${response.status()}`,
            );
          }
          return matches && response.status() === 200;
        },
        { timeout: 60000 },
      );

      // Tenta clicar no botao de filtrar usando seletores mais flexiveis
      logger.debug('[CFMV] Trying to click submit button...');
      const filtrarBtn = page.getByRole('button', { name: /filtrar/i });
      const filtrarCount = await filtrarBtn.count();
      logger.debug(`[CFMV] getByRole button "filtrar" count: ${filtrarCount}`);

      if (filtrarCount > 0) {
        await filtrarBtn.click();
      } else {
        // Fallback: tenta por texto em qualquer elemento clicavel
        const anyFiltrar = page.locator('text=/filtrar/i');
        const anyFiltrarCount = await anyFiltrar.count();
        logger.debug(`[CFMV] text=/filtrar/i count: ${anyFiltrarCount}`);

        if (anyFiltrarCount > 0) {
          await anyFiltrar.first().click();
        } else {
          // Ultimo fallback: clica no primeiro botao submit ou button visivel
          logger.warn('[CFMV] No "Filtrar" button found, trying first visible button...');
          const firstBtn = page.locator('button:visible, input[type="submit"]:visible').first();
          await firstBtn.click();
        }
      }
      logger.debug('[CFMV] Submit button clicked, waiting for API response...');

      // Aguarda a resposta da API
      const apiResponse = await responsePromise;

      const responseData = await apiResponse.json();

      if (
        !responseData ||
        responseData.type !== 'sucess' ||
        !responseData.data ||
        responseData.data.length === 0
      ) {
        return {
          found: false,
          active: false,
          name: null,
          registrationNumber: null,
          state: null,
          rawData: null,
        };
      }

      const professional = responseData.data[0];

      return {
        found: true,
        active: professional.atuante === true,
        name: professional.nome || null,
        registrationNumber: professional.pf_inscricao || null,
        state: professional.pf_uf || null,
        rawData: professional,
      };
    } catch (error) {
      if (error instanceof DomainError) {
        throw error;
      }

      const errorMessage = error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      logger.error(`[CFMV] Scraping failed: ${errorMessage}`);
      if (errorStack) {
        logger.error(`[CFMV] Stack trace: ${errorStack}`);
      }

      throw new DomainError(
        'Unable to verify CRMV with CFMV service. Please try again later.',
        502,
      );
    } finally {
      if (browser) {
        logger.debug('[CFMV] Closing browser...');
        await browser.close();
        logger.debug('[CFMV] Browser closed');
      }
    }
  }
}
