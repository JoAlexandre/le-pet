class PaginatedResponse<T> {
  final bool success;
  final List<T> data;
  final int limit;
  final int offset;
  final int total;

  PaginatedResponse({
    required this.success,
    required this.data,
    required this.limit,
    required this.offset,
    required this.total,
  });

  factory PaginatedResponse.fromJson(
    Map<String, dynamic> json,
    T Function(Map<String, dynamic>) itemBuilder,
  ) {
    return PaginatedResponse(
      success: json['success'] as bool? ?? true,
      data: (json['data'] as List<dynamic>? ?? [])
          .map((item) => itemBuilder(item as Map<String, dynamic>))
          .toList(),
      limit: json['limit'] as int? ?? 50,
      offset: json['offset'] as int? ?? 0,
      total: json['total'] as int? ?? 0,
    );
  }

  int get currentPage => (offset ~/ limit) + 1;
  int get totalPages => (total / limit).ceil();
  bool get hasMoreData => offset + data.length < total;
  int get nextOffset => offset + limit;
  bool get isLastPage => !hasMoreData;
}
