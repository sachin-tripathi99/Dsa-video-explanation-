class Solution {
    public int singleNonDuplicate(int[] nums) {
        int x = 0;
        for (int v : nums) x ^= v;              // pairs cancel out
        return x;
    }
}
