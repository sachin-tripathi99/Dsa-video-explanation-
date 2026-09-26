class Solution:
    def shipWithinDays(self, weights: List[int], days: int) -> int:
        def needed(cap):
            d, load = 1, 0
            for x in weights:
                if load + x > cap:
                    d += 1
                    load = 0
                load += x
            return d

        cap = max(weights)
        while needed(cap) > days:
            cap += 1
        return cap
