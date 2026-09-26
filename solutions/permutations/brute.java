class Solution {
    private final List<List<Integer>> out = new ArrayList<>();

    public List<List<Integer>> permute(int[] nums) {
        seq(nums, new ArrayList<>());
        return out;
    }

    private void seq(int[] nums, List<Integer> idx) {       // every sequence of indices
        if (idx.size() == nums.length) {
            if (new HashSet<>(idx).size() == nums.length) { // keep only repeat-free ones
                List<Integer> p = new ArrayList<>();
                for (int i : idx) p.add(nums[i]);
                out.add(p);
            }
            return;
        }
        for (int i = 0; i < nums.length; i++) {
            idx.add(i);
            seq(nums, idx);
            idx.remove(idx.size() - 1);
        }
    }
}
