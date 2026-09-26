class Solution:
    def findClosestElements(self, arr: List[int], k: int, x: int) -> List[int]:
        lo, hi = 0, len(arr) - k                # window start in [0, n − k]
        while lo < hi:
            m = (lo + hi) // 2
            if x - arr[m] > arr[m + k] - x:     # a[m] is farther: move right
                lo = m + 1
            else:
                hi = m
        return arr[lo:lo + k]
