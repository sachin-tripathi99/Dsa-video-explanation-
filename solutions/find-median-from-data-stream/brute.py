class MedianFinder:
    def __init__(self):
        self.a = []

    def addNum(self, num: int) -> None:
        self.a.append(num)

    def findMedian(self) -> float:
        s = sorted(self.a)                      # sort on every query
        n = len(s)
        return s[n // 2] if n % 2 else (s[n // 2 - 1] + s[n // 2]) / 2
