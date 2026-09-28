class Solution {
    public int singleNumber(int[] nums) {
        int ones = 0, twos = 0;                             // per-bit counter mod 3
        for (int x : nums) {
            ones = (ones ^ x) & ~twos;
            twos = (twos ^ x) & ~ones;
        }
        return ones;
    }
}
