class Solution {
    public int[] plusOne(int[] digits) {
        for (int i = digits.length - 1; i >= 0; i--) {
            if (digits[i] < 9) {
                digits[i]++;                     // no carry: done
                return digits;
            }
            digits[i] = 0;                       // 9 + 1 = 10: write 0, carry 1
        }
        int[] out = new int[digits.length + 1];  // all digits were 9
        out[0] = 1;
        return out;
    }
}
