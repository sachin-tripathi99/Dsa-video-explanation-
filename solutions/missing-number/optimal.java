class Solution {
    public int missingNumber(int[] nums) {
        int n = nums.length;
        int expected = n * (n + 1) / 2;         // 0 + 1 + … + n
        int actual = 0;
        for (int x : nums) actual += x;
        return expected - actual;
    }
}
