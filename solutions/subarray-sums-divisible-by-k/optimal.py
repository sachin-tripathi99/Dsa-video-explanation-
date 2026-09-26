class Solution:
    def subarraysDivByK(self, nums: List[int], k: int) -> int:
        count = [0] * k
        count[0] = 1                            # the empty prefix
        run = ans = 0
        for x in nums:
            run = (run + x) % k                 # Python's % is already non-negative
            ans += count[run]
            count[run] += 1
        return ans
