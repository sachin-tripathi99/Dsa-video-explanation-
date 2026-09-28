class Solution:
    def rangeBitwiseAnd(self, left: int, right: int) -> int:
        shift = 0
        while left < right:                     # drop columns where they may differ
            left >>= 1
            right >>= 1
            shift += 1
        return left << shift
