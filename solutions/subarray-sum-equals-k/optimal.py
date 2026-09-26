class Solution:
    def subarraySum(self, nums: List[int], k: int) -> int:
        count = Counter({0: 1})                 # the empty prefix
        run = ans = 0
        for x in nums:
            run += x
            ans += count[run - k]
            count[run] += 1
        return ans
