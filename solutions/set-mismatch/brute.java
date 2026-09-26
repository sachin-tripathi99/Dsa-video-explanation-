class Solution {
    public int[] findErrorNums(int[] nums) {
        int n = nums.length;
        int[] count = new int[n + 1];
        for (int x : nums) count[x]++;
        int dup = 0, miss = 0;
        for (int x = 1; x <= n; x++) {
            if (count[x] == 2) dup = x;
            if (count[x] == 0) miss = x;
        }
        return new int[]{dup, miss};
    }
}
