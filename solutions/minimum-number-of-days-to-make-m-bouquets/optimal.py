class Solution:
    def minDays(self, bloomDay: List[int], m: int, k: int) -> int:
        if m * k > len(bloomDay):
            return -1                           # not enough flowers ever

        def count(day):                         # bouquets of k adjacent bloomed flowers
            run = n = 0
            for x in bloomDay:
                if x <= day:
                    run += 1
                    if run == k:
                        n += 1
                        run = 0
                else:
                    run = 0
            return n

        lo, hi = min(bloomDay), max(bloomDay)
        while lo < hi:
            mid = (lo + hi) // 2
            if count(mid) >= m:
                hi = mid
            else:
                lo = mid + 1
        return lo
