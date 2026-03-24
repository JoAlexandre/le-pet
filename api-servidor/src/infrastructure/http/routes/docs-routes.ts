import { Router, Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from '../config/swagger-config';

const docsRouter = Router();

function requireDocsAccess(req: Request, res: Response, next: NextFunction): void {
  if (!req.session?.userId) {
    res.redirect('/login');
    return;
  }

  const email = req.session.email;
  if (!email || !process.env.ALLOWED_DOCS_EMAILS?.includes(email.toLowerCase())) {
    req.session.destroy(() => {
      res.redirect('/login?error=docs_access_denied');
    });
    return;
  }

  next();
}

// Endpoint que retorna o token JWT da sessao para o Swagger UI
docsRouter.get('/docs/session-token', requireDocsAccess, (req: Request, res: Response) => {
  const token = req.session?.token || '';
  res.json({ token });
});

const SWAGGER_AUTH_JS = `
(function() {
  // Botao de logout
  var interval = setInterval(function() {
    var topbar = document.querySelector('.topbar');
    if (topbar && !document.getElementById('logout-btn')) {
      var btn = document.createElement('button');
      btn.id = 'logout-btn';
      btn.textContent = 'Sair';
      btn.onclick = function() { window.location.href = '/logout'; };
      topbar.appendChild(btn);
      clearInterval(interval);
    }
  }, 200);

  // Auto-authorize com token JWT da sessao
  var authInterval = setInterval(function() {
    if (window.ui) {
      fetch('/api/v1/docs/session-token', { credentials: 'same-origin' })
        .then(function(r) { return r.json(); })
        .then(function(data) {
          if (data.token) {
            window.ui.preauthorizeApiKey('bearerAuth', data.token);
          }
        });
      clearInterval(authInterval);
    }
  }, 500);
})();
`;

const LOGOUT_BUTTON_CSS = `
  .topbar { position: relative; }
  .topbar::after { content: ''; clear: both; display: table; }
  #logout-btn {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: #ff4444;
    color: #fff;
    border: none;
    padding: 8px 20px;
    border-radius: 6px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
  #logout-btn:hover { background: #cc0000; }
`;

const swaggerOptions = {
  customCss: LOGOUT_BUTTON_CSS,
  customJsStr: SWAGGER_AUTH_JS,
  swaggerOptions: {
    persistAuthorization: true,
  },
};

docsRouter.use(
  '/docs',
  requireDocsAccess,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerOptions as swaggerUi.SwaggerUiOptions),
);

export { docsRouter };
