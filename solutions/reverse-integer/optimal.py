class Solution:
    def reverse(self, x: int) -> int:
        INT_MAX = 2**31 - 1
        sign = -1 if x < 0 else 1
        x = abs(x)                           # Python's % floors, so work with |x|
        rev = 0
        while x:
            d = x % 10
            x //= 10
            if rev > INT_MAX // 10:          # rev * 10 would leave the 32-bit range
                return 0
            rev = rev * 10 + d
        rev *= sign
        return rev if -2**31 <= rev <= INT_MAX else 0
