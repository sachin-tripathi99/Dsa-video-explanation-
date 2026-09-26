class Solution:
    def shipWithinDays(self, weights: List[int], days: int) -> int:
        def needed(cap):                        # greedy: new day when the next box does not fit
            d, load = 1, 0
            for x in weights:
                if load + x > cap:
                    d += 1
                    load = 0
                load += x
            return d

        lo, hi = max(weights), sum(weights)     # [heaviest, total]
        while lo < hi:
            mid = (lo + hi) // 2
            if needed(mid) <= days:
                hi = mid
            else:
                lo = mid + 1
        return lo
