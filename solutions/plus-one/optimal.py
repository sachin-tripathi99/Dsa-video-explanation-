class Solution:
    def plusOne(self, digits: List[int]) -> List[int]:
        for i in range(len(digits) - 1, -1, -1):
            if digits[i] < 9:
                digits[i] += 1                   # no carry: done
                return digits
            digits[i] = 0                        # 9 + 1 = 10: write 0, carry 1
        return [1] + digits                      # all digits were 9
