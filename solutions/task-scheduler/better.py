import heapq
from collections import Counter

class Solution:
    def leastInterval(self, tasks: List[str], n: int) -> int:
        heap = [-c for c in Counter(tasks).values()]    # remaining counts, max first
        heapq.heapify(heap)
        time = 0
        while heap:
            used = []
            for _ in range(n + 1):              # one cycle: n + 1 different tasks
                if not heap:
                    break
                used.append(heapq.heappop(heap) + 1)
            for c in used:
                if c < 0:
                    heapq.heappush(heap, c)
            time += n + 1 if heap else len(used)   # no trailing idle
        return time
