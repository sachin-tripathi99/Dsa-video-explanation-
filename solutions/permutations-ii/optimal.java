class Solution {
    private final List<List<Integer>> out = new ArrayList<>();

    public List<List<Integer>> permuteUnique(int[] nums) {
        Arrays.sort(nums);
        go(nums, new boolean[nums.length], new ArrayList<>());
        return out;
    }

    private void go(int[] nums, boolean[] used, List<Integer> path) {
        if (path.size() == nums.length) { out.add(new ArrayList<>(path)); return; }
        for (int i = 0; i < nums.length; i++) {
            if (used[i]) continue;
            if (i > 0 && nums[i] == nums[i - 1] && !used[i - 1]) continue;   // left copy first
            used[i] = true; path.add(nums[i]);
            go(nums, used, path);
            path.remove(path.size() - 1); used[i] = false;
        }
    }
}
