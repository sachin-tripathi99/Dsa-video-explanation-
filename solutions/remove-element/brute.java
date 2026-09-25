class Solution {
    public int removeElement(int[] nums, int val) {
        List<Integer> keep = new ArrayList<>();
        for (int x : nums) if (x != val) keep.add(x);
        for (int i = 0; i < keep.size(); i++) nums[i] = keep.get(i);
        return keep.size();
    }
}
