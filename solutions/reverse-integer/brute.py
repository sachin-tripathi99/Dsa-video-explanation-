class Solution:
    def reverse(self, x: int) -> int:
        sign = -1 if x < 0 else 1
        r = sign * int(str(abs(x))[::-1])
        return r if -2**31 <= r <= 2**31 - 1 else 0
