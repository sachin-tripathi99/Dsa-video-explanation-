class Solution {
    public int singleNumber(int[] nums) {
        int result = 0;
        for (int b = 0; b < 32; b++) {
            int c = 0;
            for (int x : nums) c += (x >>> b) & 1;          // ones in this column
            if (c % 3 != 0) result |= 1 << b;               // the loner's bit
        }
        return result;
    }
}
