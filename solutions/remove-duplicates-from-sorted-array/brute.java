class Solution {
    public int removeDuplicates(int[] nums) {
        List<Integer> keep = new ArrayList<>();
        for (int x : nums)
            if (keep.isEmpty() || keep.get(keep.size() - 1) != x) keep.add(x);
        for (int i = 0; i < keep.size(); i++) nums[i] = keep.get(i);
        return keep.size();
    }
}
