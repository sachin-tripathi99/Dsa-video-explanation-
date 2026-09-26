class Solution {
    public ListNode mergeKLists(ListNode[] lists) {
        List<Integer> vals = new ArrayList<>();
        for (ListNode l : lists) for (ListNode p = l; p != null; p = p.next) vals.add(p.val);
        Collections.sort(vals);
        ListNode dummy = new ListNode(0), tail = dummy;
        for (int x : vals) { tail.next = new ListNode(x); tail = tail.next; }
        return dummy.next;
    }
}
