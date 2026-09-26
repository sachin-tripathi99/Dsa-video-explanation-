class Solution:
    def smallestDivisor(self, nums: List[int], threshold: int) -> int:
        d = 1
        while sum((x + d - 1) // d for x in nums) > threshold:
            d += 1
        return d
