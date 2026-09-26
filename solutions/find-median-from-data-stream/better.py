import bisect

class MedianFinder:
    def __init__(self):
        self.a = []                             # kept sorted

    def addNum(self, num: int) -> None:
        bisect.insort(self.a, num)              # O(log n) search + O(n) shift

    def findMedian(self) -> float:
        a, n = self.a, len(self.a)
        return a[n // 2] if n % 2 else (a[n // 2 - 1] + a[n // 2]) / 2
