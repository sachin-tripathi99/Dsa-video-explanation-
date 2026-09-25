class Solution {
    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {
        List<Integer> vals = new ArrayList<>();
        for (ListNode c = list1; c != null; c = c.next) vals.add(c.val);
        for (ListNode c = list2; c != null; c = c.next) vals.add(c.val);
        Collections.sort(vals);
        ListNode dummy = new ListNode(0), tail = dummy;
        for (int x : vals) { tail.next = new ListNode(x); tail = tail.next; }
        return dummy.next;
    }
}
