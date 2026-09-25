class Solution {
    public int[] runningSum(int[] nums) {
        int[] out = new int[nums.length];
        for (int i = 0; i < nums.length; i++) {
            int s = 0;
            for (int j = 0; j <= i; j++) s += nums[j];   // re-add the whole prefix
            out[i] = s;
        }
        return out;
    }
}
