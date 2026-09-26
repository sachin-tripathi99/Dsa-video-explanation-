class Solution:
    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:
        iv = sorted(intervals)
        keep = [1] * len(iv)
        for i in range(len(iv)):
            for j in range(i):
                if iv[j][1] <= iv[i][0]:
                    keep[i] = max(keep[i], keep[j] + 1)
        return len(iv) - max(keep)
