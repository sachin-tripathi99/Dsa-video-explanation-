import heapq

class Solution:
    def findMaximizedCapital(self, k: int, w: int, profits: List[int], capital: List[int]) -> int:
        projects = sorted(zip(capital, profits))    # locked, by capital
        heap, j = [], 0                         # unlocked profits (negated: max-heap)
        for _ in range(k):
            while j < len(projects) and projects[j][0] <= w:
                heapq.heappush(heap, -projects[j][1])
                j += 1
            if not heap:
                break
            w -= heapq.heappop(heap)
        return w
