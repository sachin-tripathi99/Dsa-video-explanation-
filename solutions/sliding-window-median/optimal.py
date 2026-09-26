import heapq
from collections import defaultdict

class Solution:
    def medianSlidingWindow(self, nums: List[int], k: int) -> List[float]:
        lo, hi = [], []                         # lo: negatives (max-heap), hi: min-heap
        delayed = defaultdict(int)              # lazy deletions
        size = [0, 0]                           # live counts of lo, hi

        def prune(h, sign):
            while h and delayed[sign * h[0]] > 0:
                delayed[sign * h[0]] -= 1
                heapq.heappop(h)

        def balance():
            if size[0] > size[1] + 1:
                heapq.heappush(hi, -heapq.heappop(lo)); size[0] -= 1; size[1] += 1; prune(lo, -1)
            elif size[0] < size[1]:
                heapq.heappush(lo, -heapq.heappop(hi)); size[1] -= 1; size[0] += 1; prune(hi, 1)

        def insert(x):
            if not lo or x <= -lo[0]:
                heapq.heappush(lo, -x); size[0] += 1
            else:
                heapq.heappush(hi, x); size[1] += 1
            balance()

        def erase(x):
            delayed[x] += 1
            if x <= -lo[0]:
                size[0] -= 1
                if x == -lo[0]:
                    prune(lo, -1)
            else:
                size[1] -= 1
                if x == hi[0]:
                    prune(hi, 1)
            balance()

        def median():
            return float(-lo[0]) if k % 2 else (-lo[0] + hi[0]) / 2

        for x in nums[:k]:
            insert(x)
        out = [median()]
        for i in range(k, len(nums)):
            insert(nums[i])
            erase(nums[i - k])
            out.append(median())
        return out
