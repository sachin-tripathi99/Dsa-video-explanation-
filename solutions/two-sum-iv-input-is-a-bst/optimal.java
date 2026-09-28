class Solution {
    public boolean findTarget(TreeNode root, int k) {
        Deque<TreeNode> lo = new ArrayDeque<>(), hi = new ArrayDeque<>();
        for (TreeNode n = root; n != null; n = n.left) lo.push(n);    // smallest on top
        for (TreeNode n = root; n != null; n = n.right) hi.push(n);   // largest on top
        while (!lo.isEmpty() && !hi.isEmpty() && lo.peek() != hi.peek()) {
            int s = lo.peek().val + hi.peek().val;
            if (s == k) return true;
            if (s < k) {                                    // next smallest
                TreeNode n = lo.pop();
                for (n = n.right; n != null; n = n.left) lo.push(n);
            } else {                                        // next largest
                TreeNode n = hi.pop();
                for (n = n.left; n != null; n = n.right) hi.push(n);
            }
        }
        return false;
    }
}
