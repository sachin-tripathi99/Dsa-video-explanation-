class Solution:
    def splitArray(self, nums: List[int], k: int) -> int:
        n = len(nums)
        best = float("inf")

        def go(start, parts, worst):            # try every end for the part starting at `start`
            nonlocal best
            if start == n:
                if parts == 0:
                    best = min(best, worst)
                return
            if parts == 0:
                return
            s = 0
            for end in range(start, n):
                s += nums[end]
                go(end + 1, parts - 1, max(worst, s))

        go(0, k, 0)
        return best
