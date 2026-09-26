class Solution:
    def findDuplicates(self, nums: List[int]) -> List[int]:
        seen, out = set(), []
        for x in nums:
            if x in seen:
                out.append(x)
            seen.add(x)
        return out
