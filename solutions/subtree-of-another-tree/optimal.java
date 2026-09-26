class Solution {
    public boolean isSubtree(TreeNode root, TreeNode subRoot) {
        StringBuilder a = new StringBuilder(), b = new StringBuilder();
        ser(root, a);
        ser(subRoot, b);
        return kmp(a.toString(), b.toString());
    }

    private void ser(TreeNode n, StringBuilder sb) {        // preorder with null markers
        if (n == null) { sb.append(",#"); return; }
        sb.append(',').append(n.val);
        ser(n.left, sb);
        ser(n.right, sb);
    }

    private boolean kmp(String text, String pat) {
        int[] fail = new int[pat.length()];
        for (int i = 1, k = 0; i < pat.length(); i++) {
            while (k > 0 && pat.charAt(i) != pat.charAt(k)) k = fail[k - 1];
            if (pat.charAt(i) == pat.charAt(k)) k++;
            fail[i] = k;
        }
        for (int i = 0, k = 0; i < text.length(); i++) {
            while (k > 0 && text.charAt(i) != pat.charAt(k)) k = fail[k - 1];
            if (text.charAt(i) == pat.charAt(k)) k++;
            if (k == pat.length()) return true;
        }
        return false;
    }
}
