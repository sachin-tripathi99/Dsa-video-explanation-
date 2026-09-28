class Solution:
    def rangeBitwiseAnd(self, left: int, right: int) -> int:
        result = left
        x = left + 1
        while x <= right and result:            # stop once zero
            result &= x
            x += 1
        return result
