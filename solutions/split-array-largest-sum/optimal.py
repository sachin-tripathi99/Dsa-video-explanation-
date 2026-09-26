class Solution:
    def splitArray(self, nums: List[int], k: int) -> int:
        def parts(cap):                         # greedy: new part when the next number overflows
            p, s = 1, 0
            for x in nums:
                if s + x > cap:
                    p += 1
                    s = 0
                s += x
            return p

        lo, hi = max(nums), sum(nums)           # [largest element, total]
        while lo < hi:
            mid = (lo + hi) // 2
            if parts(mid) <= k:
                hi = mid                        # cap achievable
            else:
                lo = mid + 1
        return lo
