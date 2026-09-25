class Solution:
    def trailingZeroes(self, n: int) -> int:
        count = 0
        while n > 0:
            n //= 5            # how many numbers have one more factor of 5
            count += n
        return count
