class Solution {
    public void sortColors(int[] nums) {
        int[] count = new int[3];
        for (int x : nums) count[x]++;
        int k = 0;
        for (int c = 0; c < 3; c++)
            for (int t = 0; t < count[c]; t++) nums[k++] = c;
    }
}
