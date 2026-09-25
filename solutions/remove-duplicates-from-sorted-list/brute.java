class Solution {
    public ListNode deleteDuplicates(ListNode head) {
        Set<Integer> seen = new HashSet<>();
        ListNode dummy = new ListNode(0), tail = dummy;
        for (ListNode c = head; c != null; c = c.next) {
            if (seen.add(c.val)) { tail.next = new ListNode(c.val); tail = tail.next; }
        }
        return dummy.next;
    }
}
