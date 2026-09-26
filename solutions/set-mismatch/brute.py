class Solution:
    def findErrorNums(self, nums: List[int]) -> List[int]:
        count = Counter(nums)
        n = len(nums)
        dup = next(x for x in range(1, n + 1) if count[x] == 2)
        miss = next(x for x in range(1, n + 1) if count[x] == 0)
        return [dup, miss]
