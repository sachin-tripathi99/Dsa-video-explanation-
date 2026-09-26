import heapq

class Solution:
    def kthSmallest(self, matrix: List[List[int]], k: int) -> int:
        n = len(matrix)
        heap = [(matrix[r][0], r, 0) for r in range(n)]   # row heads
        heapq.heapify(heap)
        for _ in range(k - 1):
            _, r, c = heapq.heappop(heap)
            if c + 1 < n:
                heapq.heappush(heap, (matrix[r][c + 1], r, c + 1))   # next in the same row
        return heap[0][0]
