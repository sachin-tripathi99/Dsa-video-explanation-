class Solution {
    public void reorderList(ListNode head) {
        List<ListNode> nodes = new ArrayList<>();
        for (ListNode p = head; p != null; p = p.next) nodes.add(p);
        int l = 0, r = nodes.size() - 1;
        while (l < r) {
            nodes.get(l).next = nodes.get(r);
            l++;
            if (l == r) break;
            nodes.get(r).next = nodes.get(l);
            r--;
        }
        nodes.get(l).next = null;
    }
}
