class Solution:
    def trailingZeroes(self, n: int) -> int:
        count = 0
        for i in range(5, n + 1, 5):          # only multiples of 5 contribute
            x = i
            while x % 5 == 0:
                count += 1
                x //= 5
        return count
