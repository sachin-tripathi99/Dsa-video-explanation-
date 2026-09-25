class Solution:
    def majorityElement(self, nums: List[int]) -> int:
        candidate, count = None, 0
        for x in nums:
            if count == 0:
                candidate = x                       # start a new candidate
            count += 1 if x == candidate else -1    # support or cancel
        return candidate
