class Solution:
    def deleteAndEarn(self, nums: List[int]) -> int:
        m = max(nums)
        pts = [0] * (m + 1)
        for x in nums:
            pts[x] += x                         # bucket points by value

        def best(x):                            # best using values 0..x
            if x < 0:
                return 0
            return max(best(x - 1), best(x - 2) + pts[x])

        return best(m)
