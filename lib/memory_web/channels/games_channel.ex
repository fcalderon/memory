defmodule MemoryWeb.GamesChannel do
  use MemoryWeb, :channel

  alias Memory.Game

  def join("games:" <> name, payload, socket) do
    IO.puts("Joining game")
    game = Game.new()
    socket = socket
    |> assign(:game, game)
    |> assign(:name, name)
    {:ok, %{"join" => name, "game" => Game.client_view()}, socket}
  end

  def handle_in("guess", %{"location" => ll}, socket) do
    IO.puts("Handling in")
    IO.inspect(ll)
    game = Game.guess(socket.assigns[:game])
    socket = assign(socket, :game, game)
    {:reply, {:ok, %{"game" => Game.client_view(), "clicks" => game.clicks}}, socket}

#    socket = assign(socket, :game, game)
  end
end
