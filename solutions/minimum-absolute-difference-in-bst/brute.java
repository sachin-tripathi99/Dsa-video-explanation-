class Solution {
    public int getMinimumDifference(TreeNode root) {
        List<Integer> vals = new ArrayList<>();
        collect(root, vals);
        int best = Integer.MAX_VALUE;
        for (int i = 0; i < vals.size(); i++)
            for (int j = i + 1; j < vals.size(); j++) best = Math.min(best, Math.abs(vals.get(i) - vals.get(j)));
        return best;
    }

    private void collect(TreeNode n, List<Integer> out) {
        if (n == null) return;
        out.add(n.val);
        collect(n.left, out);
        collect(n.right, out);
    }
}
