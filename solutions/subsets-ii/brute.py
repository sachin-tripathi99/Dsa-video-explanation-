class Solution:
    def subsetsWithDup(self, nums: List[int]) -> List[List[int]]:
        n = len(nums)
        seen = {tuple(sorted(nums[i] for i in range(n) if mask >> i & 1)) for mask in range(1 << n)}
        return [list(t) for t in seen]
