class Solution:
    def mySqrt(self, x: int) -> int:
        lo, hi = 0, x
        while lo < hi:
            mid = (lo + hi + 1) // 2            # round up: we move lo = mid
            if mid * mid <= x:
                lo = mid
            else:
                hi = mid - 1
        return lo
