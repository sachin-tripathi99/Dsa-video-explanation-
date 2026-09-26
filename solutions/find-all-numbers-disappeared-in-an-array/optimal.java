class Solution {
    public List<Integer> findDisappearedNumbers(int[] nums) {
        int i = 0;
        while (i < nums.length) {
            int home = nums[i] - 1;
            if (nums[i] != nums[home]) { int t = nums[i]; nums[i] = nums[home]; nums[home] = t; }
            else i++;                                   // home, or a duplicate
        }
        List<Integer> out = new ArrayList<>();
        for (int k = 0; k < nums.length; k++) if (nums[k] != k + 1) out.add(k + 1);
        return out;
    }
}
