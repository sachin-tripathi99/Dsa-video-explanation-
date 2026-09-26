import java.util.*;

class ListNode {
    int val;
    ListNode next;
    ListNode() {}
    ListNode(int val) { this.val = val; }
    ListNode(int val, ListNode next) { this.val = val; this.next = next; }
}

class TreeNode {
    int val;
    TreeNode left;
    TreeNode right;
    TreeNode() {}
    TreeNode(int val) { this.val = val; }
    TreeNode(int val, TreeNode left, TreeNode right) { this.val = val; this.left = left; this.right = right; }
}

final class H {
    static List<ListNode> lastNodes = new ArrayList<>();

    @SafeVarargs
    static <T> List<T> L(T... xs) { return new ArrayList<>(Arrays.asList(xs)); }

    /** Large int arrays arrive as comma-separated chunks (array literals would exceed the 64 KB method limit). */
    static int[] ints(String... parts) {
        String all = String.join(",", parts);
        if (all.isEmpty()) return new int[0];
        String[] xs = all.split(",");
        int[] out = new int[xs.length];
        for (int i = 0; i < xs.length; i++) out[i] = Integer.parseInt(xs[i]);
        return out;
    }

    static ListNode list(int[] vals) {
        ListNode dummy = new ListNode(0), cur = dummy;
        lastNodes = new ArrayList<>();
        for (int v : vals) { cur.next = new ListNode(v); cur = cur.next; lastNodes.add(cur); }
        return dummy.next;
    }

    static ListNode cycle(int[] vals, int pos) {
        ListNode head = list(vals);
        if (pos >= 0 && !lastNodes.isEmpty()) lastNodes.get(lastNodes.size() - 1).next = lastNodes.get(pos);
        return head;
    }

    static int indexOf(ListNode n) {
        if (n == null) return -1;
        for (int i = 0; i < lastNodes.size(); i++) if (lastNodes.get(i) == n) return i;
        return -2;
    }

    static TreeNode tree(Integer[] vals) {
        if (vals.length == 0 || vals[0] == null) return null;
        TreeNode root = new TreeNode(vals[0]);
        Deque<TreeNode> q = new ArrayDeque<>();
        q.add(root);
        int i = 1;
        while (!q.isEmpty() && i < vals.length) {
            TreeNode cur = q.poll();
            if (i < vals.length && vals[i] != null) { cur.left = new TreeNode(vals[i]); q.add(cur.left); }
            i++;
            if (i < vals.length && vals[i] != null) { cur.right = new TreeNode(vals[i]); q.add(cur.right); }
            i++;
        }
        return root;
    }

    static TreeNode find(TreeNode root, int val) {
        if (root == null) return null;
        if (root.val == val) return root;
        TreeNode l = find(root.left, val);
        return l != null ? l : find(root.right, val);
    }

    static String str(String s) {
        StringBuilder sb = new StringBuilder("\"");
        for (char c : s.toCharArray()) {
            if (c == '"') sb.append("\\\"");
            else if (c == '\\') sb.append("\\\\");
            else if (c == '\n') sb.append("\\n");
            else if (c < 32) sb.append(String.format("\\u%04x", (int) c));
            else sb.append(c);
        }
        return sb.append('"').toString();
    }

    static String num(double d) {
        if (Double.isNaN(d) || Double.isInfinite(d)) return "null";
        return Double.toString(d);
    }

    static String ser(Object o) {
        if (o == null) return "null";
        if (o instanceof String) return str((String) o);
        if (o instanceof Character) return str(String.valueOf(o));
        if (o instanceof Double) return num((Double) o);
        if (o instanceof Float) return num((Float) o);
        if (o instanceof Number || o instanceof Boolean) return o.toString();
        if (o instanceof int[]) { int[] a = (int[]) o; StringBuilder sb = new StringBuilder("["); for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(','); sb.append(a[i]); } return sb.append(']').toString(); }
        if (o instanceof long[]) { long[] a = (long[]) o; StringBuilder sb = new StringBuilder("["); for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(','); sb.append(a[i]); } return sb.append(']').toString(); }
        if (o instanceof double[]) { double[] a = (double[]) o; StringBuilder sb = new StringBuilder("["); for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(','); sb.append(num(a[i])); } return sb.append(']').toString(); }
        if (o instanceof boolean[]) { boolean[] a = (boolean[]) o; StringBuilder sb = new StringBuilder("["); for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(','); sb.append(a[i]); } return sb.append(']').toString(); }
        if (o instanceof char[]) { char[] a = (char[]) o; StringBuilder sb = new StringBuilder("["); for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(','); sb.append(str(String.valueOf(a[i]))); } return sb.append(']').toString(); }
        if (o instanceof Object[]) { Object[] a = (Object[]) o; StringBuilder sb = new StringBuilder("["); for (int i = 0; i < a.length; i++) { if (i > 0) sb.append(','); sb.append(ser(a[i])); } return sb.append(']').toString(); }
        if (o instanceof Iterable) { StringBuilder sb = new StringBuilder("["); boolean first = true; for (Object x : (Iterable<?>) o) { if (!first) sb.append(','); first = false; sb.append(ser(x)); } return sb.append(']').toString(); }
        if (o instanceof ListNode) {
            StringBuilder sb = new StringBuilder("[");
            ListNode cur = (ListNode) o; int guard = 0;
            while (cur != null && guard++ < 100000) { if (sb.length() > 1) sb.append(','); sb.append(cur.val); cur = cur.next; }
            return sb.append(']').toString();
        }
        if (o instanceof TreeNode) {
            List<String> out = new ArrayList<>();
            Deque<TreeNode> q = new ArrayDeque<>();
            List<TreeNode> order = new ArrayList<>();
            order.add((TreeNode) o);
            for (int i = 0; i < order.size(); i++) {
                TreeNode t = order.get(i);
                if (t == null) { out.add("null"); continue; }
                out.add(String.valueOf(t.val));
                order.add(t.left);
                order.add(t.right);
                if (order.size() > 200000) break;
            }
            while (!out.isEmpty() && out.get(out.size() - 1).equals("null")) out.remove(out.size() - 1);
            return "[" + String.join(",", out) + "]";
        }
        return str(o.toString());
    }

    static void emit(String id, int t, String json) {
        System.out.println("@@" + id + "\t" + t + "\t" + json);
    }

    static void fail(String id, int t, Throwable e) {
        String msg = e.getClass().getSimpleName() + ": " + String.valueOf(e.getMessage()).replace('\n', ' ');
        System.out.println("@@" + id + "\t" + t + "\tERR\t" + msg);
    }
}
