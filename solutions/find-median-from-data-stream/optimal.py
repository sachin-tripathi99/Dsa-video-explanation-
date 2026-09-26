import heapq

class MedianFinder:
    def __init__(self):
        self.lo = []                            # smaller half, as negatives (max-heap)
        self.hi = []                            # bigger half (min-heap)

    def addNum(self, num: int) -> None:
        heapq.heappush(self.lo, -num)
        heapq.heappush(self.hi, -heapq.heappop(self.lo))   # largest small → hi
        if len(self.hi) > len(self.lo):
            heapq.heappush(self.lo, -heapq.heappop(self.hi))   # lo keeps the extra one

    def findMedian(self) -> float:
        if len(self.lo) > len(self.hi):
            return -self.lo[0]
        return (-self.lo[0] + self.hi[0]) / 2
